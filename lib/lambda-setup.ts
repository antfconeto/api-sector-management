import { aws_ssm as ssm, aws_lambda as lambda, Stack } from "aws-cdk-lib";


export interface LambdasFunctions{
    name:string,
    function:lambda.Function
}
export class LambdaSetup{
    private stack:Stack
    constructor(stack:Stack){
        this.stack = stack
    }

   public setupLambdas(){
        const lambdaNames = ['']
    }
}