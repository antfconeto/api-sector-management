
# Sector Management API

A serverless GraphQL API built with AWS AppSync for managing sectors within the organization.

## 🛠 Technologies

- AWS CDK (TypeScript)
- AWS AppSync
- AWS Lambda
- GraphQL
- IAM
- CloudWatch
- SSM Parameter Store

## 🏗 Architecture

The project implements a serverless architecture using:
- AppSync for GraphQL API management
- Lambda functions as resolvers
- IAM roles for security
- CloudWatch for logging
- SSM for storing API credentials

## 📁 Project Structure

```
.
├── lib/                    # CDK infrastructure code
├── graphql/               # GraphQL schema definitions
├── functions/            # Lambda function implementations
├── test/                 # Test files
├── cdk.json             # CDK configuration
└── .github/             # GitHub Actions workflows
```

## 🔑 Features

### Sector Management
- Create sectors
- Update sector information
- Delete sectors
- Retrieve sector by ID
- Sector properties include:
  - Name
  - Description
  - Status
  - Active state
  - ID

### API Security
- API Key authentication
- IAM role-based access control
- Secure credential management via SSM

### Monitoring & Logging
- ALL level field logging enabled
- CloudWatch integration
- Complete request/response tracking

## 🚀 CI/CD

Automated deployment pipeline using GitHub Actions:
- Triggers on:
  - Push to master branch
  - Manual workflow dispatch
- Environment: development
- Platform: Ubuntu latest

## 🔧 Infrastructure as Code

The entire infrastructure is defined using AWS CDK in TypeScript, including:
- AppSync API configuration
- GraphQL schema deployment
- Lambda function setup
- IAM role management
- CloudWatch logging configuration
- SSM parameter creation

## 📝 API Schema

```graphql
type Sector {
    name: String
    description: String
    status: String
    active: Boolean
    id: String
}

type Mutation {
    createSector(sector: SectorInput!): Sector
    updateSector(sector: SectorInput!): Sector
    deleteSector(sectorId: String!): Boolean
}

type Query {
    getSectorById(sectorId: String!): Sector
}
```

## 🔒 Security

- API Key authentication for all operations
- IAM roles with least privilege principle
- Secure storage of API credentials in SSM
- Request/response validation

## 📊 Monitoring

- Field-level logging
- CloudWatch integration
- API metrics tracking
- Error monitoring

## 🚀 Deployment

The infrastructure is deployed using AWS CDK with automatic deployments via GitHub Actions pipeline.

## 🛡 Prerequisites

- AWS Account
- GitHub repository access
- AWS CDK CLI
- Node.js
- TypeScript

## ⚙️ Environment Setup

1. Configure AWS credentials
2. Install dependencies
3. Deploy using CDK
4. Store API credentials in SSM

## 📫 Contact

For internal support and questions, please contact the development team.
```
Email: antfcone@gmail.com
