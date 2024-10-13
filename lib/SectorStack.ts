import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DynamoSetup } from './dynamodb';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SectorStack extends cdk.Stack {
  private dynamoSetup: DynamoSetup
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    //-----Initing DynamoSetup-----\\
    this.dynamoSetup = new DynamoSetup(this)
    this.dynamoSetup.createTables()
    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'SectorStack', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
