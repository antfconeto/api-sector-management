import {
  aws_ssm as ssm,
  aws_appsync as appsync,
  Stack,
  aws_iam as iam,
  CfnOutput,
} from "aws-cdk-lib";
import { LambdasFunctions } from "./lambda-setup";
import { CloudWatchLogGroup } from "aws-cdk-lib/aws-events-targets";
import path = require("path");
import * as fs from 'fs'
export class AppsyncSetup {
  private stack: Stack;
  private SectorApi:appsync.CfnGraphQLApi
  constructor(stack: Stack) {
    this.stack = stack;
  }

  setupAppsync(lambdas: LambdasFunctions[]) {
    //-------Define roles to access Logs---------
    const roleApi = new iam.Role(this.stack, "SectorApiRole", {
      assumedBy: new iam.ServicePrincipal("appsync.amazonaws.com"),
      description: "Role to link to Sector api",
      roleName: "SectorApiRole",
      inlinePolicies: {
        CloudWatchLogsPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
              ],
              resources: ["arn:aws:logs:*:*:*"],
            }),
          ],
        }),
      },
    });
     //-------Define Sector API---------
     this.SectorApi = new appsync.CfnGraphQLApi(this.stack, "SectorApi", {
      authenticationType: appsync.AuthorizationType.API_KEY,
      name: "SectorApi",
      logConfig: {
        fieldLogLevel: "ALL",
        cloudWatchLogsRoleArn: roleApi.roleArn,
      },
    });
    //-------Define schema and link to sector api---------
    const graphqlSchema = fs.readFileSync(
        path.join(__dirname, "../graphql/schema.graphql"),
        { encoding: "utf-8" }
      );
    new appsync.CfnGraphQLSchema(this.stack, 'SectorApiSchema', {
        apiId:this.SectorApi.attrApiId,
        definition:graphqlSchema
    })

     //-------Define ApiKey---------
     const expiryTimeInSeconds = Math.floor(
        Date.now() / 1000 + 365 * 24 * 60 * 60
      ); // 1 year
    const apiKey = new appsync.CfnApiKey(this.stack,'SectorApiKey',{
        apiId:this.SectorApi.attrApiId,
        description:'SectorApiKey to access sector api',
        expires: expiryTimeInSeconds
    })

     // ---------- SSM Parameters ----------

     const apiEndpointParameter = new ssm.StringParameter(this.stack, 'SectorApiUrl', {
        parameterName: '/SectorWatch/appsync/SectorApiUrl',
        stringValue: this.SectorApi.attrGraphQlUrl,
      });
  
      const apiKeyParameter = new ssm.StringParameter(this.stack, 'SectorApiKey', {
        parameterName: '/SectorWatch/appsync/SectorApiKey',
        stringValue: apiKey.attrApiKey,
      });
  
      // ---------- Outputs ----------
      new CfnOutput(this.stack, "SectorApiUrl", {
        value: this.SectorApi.attrGraphQlUrl,
        description: "The URL of the Sector GraphQL API",
        exportName: "SectorApiUrl",
      });
  
      new CfnOutput(this.stack, "SectorApiKey", {
        value: apiKey.attrApiKey,
        description: "The API Key of the Sector GraphQL API",
        exportName: "SectorApiKey",
      });
  
      new CfnOutput(this.stack, "SectorApiId", {
        value: this.SectorApi.attrApiId,
        description: "The API ID of the Sector GraphQL API",
        exportName: "SectorApiId",
      });

      this.setupResolvers(this.SectorApi, lambdas);
  }

  setupResolvers(sectorApi:appsync.CfnGraphQLApi, lambdaFunctions:LambdasFunctions[]){
 type ResolverScopeMap = {
      [key: string]: string | null;
    };

    const resolversWithScopes: ResolverScopeMap = {
      createSector: "write:sectordata",
    };
    const ignoreLambdas = [
        ""
    ];
    lambdaFunctions.forEach(({ name, lambda }) => {
      if (ignoreLambdas.includes(name)) {
        return;
      }
      const dataSourceRole = new iam.Role(this.stack, `${name}DataSourceRole`, {
        assumedBy: new iam.ServicePrincipal("appsync.amazonaws.com"),
        inlinePolicies: {
          LambdaInvokePolicy: new iam.PolicyDocument({
            statements: [
              new iam.PolicyStatement({
                actions: ["lambda:InvokeFunction"],
                resources: [lambda.functionArn],
              }),
              ...(name in resolversWithScopes
                ? [
                    new iam.PolicyStatement({
                      actions: ["appsync:GraphQL"],
                      resources: [
                        `arn:aws:appsync:${this.stack.region}:${this.stack.account}:apis/${sectorApi}/types/Query/fields/${name}`,
                      ],
                      conditions: {
                        "ForAnyValue:StringEquals": {
                          "appsync:GraphQLScopes":
                            resolversWithScopes[name as keyof ResolverScopeMap],
                        },
                      },
                    }),
                    new iam.PolicyStatement({
                      actions: ["appsync:GraphQL"],
                      resources: [
                        `arn:aws:appsync:${this.stack.region}:${this.stack.account}:apis/${sectorApi}/types/Query/fields/${name}`,
                      ],
                      conditions: {
                        "ForAnyValue:StringEquals": {
                          "aws:SourceArn": `arn:aws:appsync:${this.stack.region}:${this.stack.account}:apis/${sectorApi}/types/Query/fields/${name}`,
                        },
                      },
                    }),
                  ]
                : [
                    // Allow API key access by omitting the scope check for API key authentication
                    new iam.PolicyStatement({
                      actions: ["appsync:GraphQL"],
                      resources: [
                        `arn:aws:appsync:${this.stack.region}:${this.stack.account}:apis/${sectorApi}/types/Query/fields/${name}`,
                      ],
                    }),
                  ]),
            ],
          }),
        },
      });

      const dataSource = new appsync.CfnDataSource(
        this.stack,
        `${name}DataSource`,
        {
          apiId: sectorApi.attrApiId,
          name: `${name}DataSource`,
          type: "AWS_LAMBDA",
          lambdaConfig: {
            lambdaFunctionArn: lambda.functionArn,
          },
          serviceRoleArn: dataSourceRole.roleArn, // Attach the role to the data source
        }
      );

      new appsync.CfnResolver(this.stack, `${name}Resolver`, {
        apiId: sectorApi.attrApiId,
        typeName:
          name.startsWith("get") || name.startsWith("list") || name.startsWith("validateToken")
            ? "Query"
            : "Mutation",
        fieldName: name,
        dataSourceName: dataSource.name,
        requestMappingTemplate:
          appsync.MappingTemplate.lambdaRequest().renderTemplate(),
        responseMappingTemplate:
          appsync.MappingTemplate.lambdaResult().renderTemplate(),
      }).addDependency(dataSource);
    });
  }
  geSectiorApi():appsync.CfnGraphQLApi{
    return this.SectorApi
  }
}
