import { aws_dynamodb as dynamodb, RemovalPolicy, Stack, aws_ssm as ssm, CfnOutput } from "aws-cdk-lib";
import { ParameterTier } from "aws-cdk-lib/aws-ssm";
interface IDynamoSetup {
  createTables(stack: Stack): void;
  getSectorTable(): dynamodb.Table;
}

class DynamoSetup implements IDynamoSetup {
  private stack: Stack;
  private sectorTable: dynamodb.Table;

  constructor(stack: Stack) {
    this.stack = stack;
  }
  createTables(): void {
    this.sectorTable = new dynamodb.Table(this.stack, "sectorTable", {
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: {name:'SK', type:dynamodb.AttributeType.STRING},
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy:RemovalPolicy.DESTROY
    });

    new ssm.StringParameter(this.stack, 'sectorTableArnParameter',{
        stringValue:this.sectorTable.tableArn,
        tier:ParameterTier.STANDARD,
        parameterName:"/SectorWatch/Sector-Management/SectorTableARN"
    })

    new CfnOutput(this.stack,'sectorTableArn', {
        value:this.sectorTable.tableArn,
        description:"Arn from tablem sector arn",
        exportName:"SectorTableArn"

    })
  }
  getSectorTable(): dynamodb.Table {
    return this.sectorTable;
  }
}
export {DynamoSetup}