import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DynamoSetup } from './dynamodb';
import { AppsyncSetup } from './appsync_setup';
import { LambdaSetup } from './lambda-setup';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SectorStack extends cdk.Stack {
  private dynamoSetup: DynamoSetup;
  private appsyncSetup:AppsyncSetup;
  private lambdaSetup:LambdaSetup;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    //-----Initing DynamoSetup-----\\
    this.dynamoSetup = new DynamoSetup(this)
    this.dynamoSetup.createTables()
    //-----Initing LambdaSetup-----\\
    this.lambdaSetup = new LambdaSetup(this)
    this.lambdaSetup.setupLambdas(this.dynamoSetup.getSectorTable())
    //-----Initing AppsyncSetup-----\\
    this.appsyncSetup = new AppsyncSetup(this)
    this.appsyncSetup.setupAppsync(this.lambdaSetup.getLambdas())

  }
}
