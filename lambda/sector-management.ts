import { Logger } from "@aws-lambda-powertools/logger";
import { SectorModel } from "./models/sector";
import { CustomError } from "./utils/feedback-util";
import { DynamoDBClient, PutItemCommand, } from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient} from '@aws-sdk/lib-dynamodb'


//-------Define DDB client-------
const ddbClient = new DynamoDBClient({
    region:process.env.AWS_REGION || 'us-east-1'
})
const ddb = DynamoDBDocumentClient.from(ddbClient,{
    marshallOptions:{
        removeUndefinedValues:true
    }
})


interface ISectorManager{
    createSector(sector:SectorModel):Promise<SectorModel>;
    updateSector(sector:SectorModel):Promise<SectorModel>;
    deleteSector(id:string, isSoft:boolean):Promise<boolean>;
    deleteSectorSoft(sector:SectorModel):Promise<SectorModel>
    getSectorById(id:string):Promise<SectorModel>
}

class SectorManager implements ISectorManager{
    private logger:Logger;
    constructor(){
        this.logger = new Logger({
            logLevel:'DEBUG',
            environment:process.env.ENVIRONMENT,
            serviceName:'ServiceManager'
        })
    }

    async createSector(sector: SectorModel): Promise<SectorModel> {
        if(!sector){
            this.logger.error(`❌ Required sector fields is empty: ${JSON.stringify(sector)}`)
            throw new CustomError(500, `❌ Required sector fields is empty: ${JSON.stringify(sector)}`)
        }
        this.logger.info(`🔁 Initing creating sector: ${JSON.stringify(sector.id)}`)
        const command = new PutItemCommand({
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
            throw new CustomError(400, `❌ Failed to create sector: ${error.message}`)
        }
        
    }
    async updateSector(sector: SectorModel): Promise<SectorModel> {
        this.logger.info(`🔁 Initing updating sector: ${JSON.stringify(sector.id)}`)
        return new SectorModel()
    }
    async deleteSector(id: string, isSoft:boolean): Promise<boolean> {
        this.logger.info(`🔁 Initing deleting sector: ${JSON.stringify(id)}`)
        return true
    }
    deleteSectorSoft(sector:SectorModel): Promise<SectorModel> {
        this.logger.info(`🔁 Initing deleting soft sector: ${JSON.stringify(sector.id)}`)
        throw new Error('')
    }
    async getSectorById(id: string): Promise<SectorModel> {
        this.logger.info(`🔁 Initing creating sector: ${JSON.stringify(id)}`)
        return new SectorModel()
    }

}

export {SectorManager, ISectorManager}