import {
  aws_ssm as ssm,
  aws_lambda as lambda,
  Stack,
  aws_iam as iam,
  aws_dynamodb as dynamodb,
  Duration,
} from "aws-cdk-lib";
import path = require("path");

export interface LambdasFunctions {
  name: string;
  lambda: lambda.Function;
}
export class LambdaSetup {
  private stack: Stack;
  private LambdasFunctions:LambdasFunctions[]
  constructor(stack: Stack) {
    this.stack = stack;
    this.LambdasFunctions = [];
  }

  public setupLambdas(sectorTable: dynamodb.Table) {
    const lambdaNames = ["createSector"];
    lambdaNames.forEach((name)=>{
        let config = {
            handler:'index.handler',
            runtime:lambda.Runtime.NODEJS_20_X,
            environment:{
                ENVIRONMENT:'development',
                SECTOR_TABLE:sectorTable.tableName,
                AWS_REGION: 'us-east-1'
            },
            functionName:`${name}Function`,
            role:this.addRoleToLambda(name,sectorTable),
            timeout:Duration.minutes(3),
            code: lambda.Code.fromAsset(path.join(__dirname, "../lambda")),
        }
     this.LambdasFunctions.push({
        name:name,
        lambda:this.createLambda(name,config)
     })
    })
  }
  private addRoleToLambda(name: string, sectorTable: dynamodb.Table) {
    return new iam.Role(this.stack, `${name}`, {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      inlinePolicies: {
        DynamoDBAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ["dynamodb:*"],
              resources: [
                sectorTable.tableArn,
                `${sectorTable.tableArn}/index/*`,
              ],
            }),
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
              ],
              resources: [
                `arn:aws:logs:${this.stack.region}:${this.stack.account}:log-group:/aws/lambda/${name}:*`,
              ],
            }),
          ],
        }),
      },
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
      ],
    });
  }
  getLambdas():LambdasFunctions[]{
    return this.LambdasFunctions
  }
  
  private createLambda(name:string,config:any){
    return new lambda.Function(this.stack,`${name}Function`,config)
  }
}
