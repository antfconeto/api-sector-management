import { Logger } from "@aws-lambda-powertools/logger";
import { SectorModel } from "../models/sector";
import { CustomError } from "../utils/feedback-util";
import { DynamoDBClient, PutItemCommand, } from "@aws-sdk/client-dynamodb";
import {DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand} from '@aws-sdk/lib-dynamodb'


//-------Define DDB client-------
const ddbClient = new DynamoDBClient({
    region:process.env.AWS_REGION || 'us-east-1'
})
const ddb = DynamoDBDocumentClient.from(ddbClient,{
    marshallOptions:{
        removeUndefinedValues:true
    }
})

interface ISectorDao{
    createSector(sector:SectorModel):Promise<SectorModel>;
    updateSector(sector:SectorModel):Promise<SectorModel>;
    deleteSector(id:string):Promise<boolean>;
    getSectorById(id:string):Promise<SectorModel | undefined>;
}

class SectorDao implements ISectorDao{
    private logger:Logger;
    constructor(){
        this.logger = new Logger({
            logLevel:'DEBUG',
            environment:process.env.ENVIRONMENT,
            serviceName:'ServiceDao'
        })
    }

    async createSector(sector: SectorModel): Promise<SectorModel> {
        if(!sector){
            this.logger.error(`❌ Required sector fields is empty: ${JSON.stringify(sector)}`)
            throw new CustomError(400, `❌ Required sector fields is empty: ${JSON.stringify(sector)}`)
        }
        this.logger.info(`🔁 Initing creating sector: ${JSON.stringify(sector.id)}`)
        const command = new PutCommand({
            TableName:process.env.SECTOR_TABLE,
            Item:sector.toItem()
        })
        try{
            this.logger.info(`▶️ Inserting Item Sector in dynamoDB: ${JSON.stringify(command)}`)
            await ddb.send(command)
            this.logger.info(`✅ Sector with id: ${sector.id} was created with success!`)
            return sector
        }catch(error:any){
            this.logger.error(`❌ Failed to create sector: ${error.message}`)
            throw new CustomError(500, `❌ Failed to create sector: ${error.message}`)
        }
    }
    async updateSector(sector: SectorModel): Promise<SectorModel> {
        if(!sector){
            this.logger.error(`❌ Required sector fields is empty: ${JSON.stringify(sector)}`)
            throw new CustomError(400, `❌ Required sector fields is empty: ${JSON.stringify(sector)}`)
        }
        this.logger.info(`🔁 Initing updating sector: ${JSON.stringify(sector.id)}`)
        const command = new UpdateCommand({
            TableName:process.env.SECTOR_TABLE,
            Key:sector.keys(),
            UpdateExpression:"SET #data = :data",
            ExpressionAttributeNames:{
                "#data": "data"
            },
            ExpressionAttributeValues:{
                ":data": sector.data
            }
        })
        try{
            this.logger.info(`▶️ Updating Item Sector in dynamoDB: ${JSON.stringify(command)}`)
            await ddb.send(command)
            this.logger.info(`✅ Sector with id: ${sector.id} was updated with success!`)
            return sector
        }catch(error:any){
            this.logger.error(`❌ Failed to update sector: ${error.message}`)
            throw new CustomError(500, `❌ Failed to update sector: ${error.message}`)
        }
    }
    async deleteSector(sectorId: string): Promise<boolean> {
        if(!sectorId){
            this.logger.error(`❌ Required sector fields is empty: ${sectorId}`)
            throw new CustomError(400, `❌ Required sector fields is empty: ${sectorId}`)
        }
        this.logger.info(`🔁 Initing Delete sector: ${sectorId}`)
        const command = new DeleteCommand({
            TableName:process.env.SECTOR_TABLE,
            Key:{
                PK:`SECTOR#${sectorId}`,
                SK:`SECTOR#${sectorId}`
            }
        })
        try{
            this.logger.info(`▶️ Deleting Item Sector in dynamoDB: ${JSON.stringify(command)}`)
            await ddb.send(command)
            this.logger.info(`✅ Sector with id: ${sectorId} was deleted with success!`)
            return true
        }catch(error:any){
            this.logger.error(`❌ Failed to delete sector: ${error.message}`)
            return false
        }
    }
    async getSectorById(sectorId: string): Promise<SectorModel | undefined> {
        if(!sectorId){
            this.logger.error(`❌ Required sector fields is empty: ${sectorId}`)
            throw new CustomError(400, `❌ Required sector fields is empty: ${sectorId}`)
        }
        this.logger.info(`🔁 Initing Getting sector: ${sectorId}`)
        const command = new GetCommand({
            TableName:process.env.SECTOR_TABLE,
            Key:{
                PK:`SECTOR#${sectorId}`,
                SK:`SECTOR#${sectorId}`
            }
        })
        try{
            this.logger.info(`▶️ Getting Item Sector in dynamoDB: ${JSON.stringify(command)}`)
            const result = await ddb.send(command)
            if(!result.Item){
                this.logger.info(`⚠️ User Not found in DynamoDB`)
                return undefined
            }
            this.logger.info(`🔍 Getted sector: ${JSON.stringify(result.Item)}`)
            this.logger.info(`✅ Sector with id: ${sectorId} was getted with success!`)
            return SectorModel.fromItem(result.Item)
        }catch(error:any){
            this.logger.error(`❌ Failed to get sector: ${error.message}`)
            throw new CustomError(400, `❌ Failed to get sector: ${error.message}`)
        }
    }
}

export {SectorDao, ISectorDao}