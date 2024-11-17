import {
    aws_lambda as lambda,
  } from "aws-cdk-lib";
export interface LambdasFunctions {
    name: string;
    lambda: lambda.Function;
  }