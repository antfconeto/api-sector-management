import { Logger } from "@aws-lambda-powertools/logger";
import { SectorModel } from "../models/sector";
import { CustomError } from "../utils/feedback-util";
import { DynamoDBClient, PutItemCommand, } from "@aws-sdk/client-dynamodb";
import {DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand} from '@aws-sdk/lib-dynamodb'
import { SectorDao, ISectorDao } from "../repositories/sector-dao";

//-------Define DDB client-------
const ddbClient = new DynamoDBClient({
    region:process.env.AWS_REGION || 'us-east-1'
})
const ddb = DynamoDBDocumentClient.from(ddbClient,{
    marshallOptions:{
        removeUndefinedValues:true
    }
})

interface ISectorManagement{
    createSector(sector:SectorModel):Promise<SectorModel>;
    updateSector(sector:SectorModel):Promise<SectorModel>;
    deleteSector(id:string, isSoft:boolean):Promise<boolean>;
    getSectorById(id:string):Promise<SectorModel | undefined>;
    deleteSectorSoft(sectorId:string):Promise<boolean>;
}

class SectorManagement implements ISectorManagement{
    private logger:Logger;
    private sectorDao:ISectorDao;
    constructor(){
        this.logger = new Logger({
            logLevel:'DEBUG',
            environment:process.env.ENVIRONMENT,
            serviceName:'ServiceDao'
        });
        this.sectorDao = new SectorDao();
    }

    async createSector(sector: SectorModel): Promise<SectorModel> {
        if(!sector){
            this.logger.error(`❌ Required sector fields is empty: ${JSON.stringify(sector)}`)
            throw new CustomError(400, `❌ Required sector fields is empty: ${JSON.stringify(sector)}`)
        }
        try{
            const result = await this.sectorDao.createSector(sector)
            return result
        }catch(error:any){
            this.logger.error(`❌ Failed to create sector: ${error.message}`)
            throw new CustomError(500, error.message)
        }
    }
    async updateSector(sector: SectorModel): Promise<SectorModel> {
        if(!sector){
            this.logger.error(`❌ Required sector fields is empty: ${JSON.stringify(sector)}`)
            throw new CustomError(400, `❌ Required sector fields is empty: ${JSON.stringify(sector)}`)
        }
        try{
            const result = await this.sectorDao.updateSector(sector)
            return result
        }catch(error:any){
            this.logger.error(`❌ Failed to update sector: ${error.message}`)
            throw new CustomError(500, error.message)
        }
    }
    async deleteSector(sectorId: string, isSoft:boolean = false): Promise<boolean> {
        if(!sectorId){
            this.logger.error(`❌ Required sector fields is empty: ${JSON.stringify(sectorId)}`)
            throw new CustomError(400, `❌ Required sector fields is empty: ${JSON.stringify(sectorId)}`)
        }
        try{
            if(isSoft){
               return await this.deleteSectorSoft(sectorId)
            }
            const result = this.sectorDao.deleteSector(sectorId)
            return result
        }catch(error:any){
            this.logger.error(`❌ Failed to delete sector: ${error.message}`)
            return false
        }
    }
    async deleteSectorSoft(sectorId:string):Promise<boolean>{
        if(!sectorId){
            this.logger.error(`❌ Required sector fields is empty: ${JSON.stringify(sectorId)}`)
            throw new CustomError(400, `❌ Required sector fields is empty: ${JSON.stringify(sectorId)}`)
        }
        this.logger.info(`🔁 Deleting is type soft, unactivating sector...`)
        try {
            const gettedSector = await this.sectorDao.getSectorById(sectorId)
            if(gettedSector?.active === true){
                this.logger.info(`⚠️ Sector already unactivated!`);
                return true;
            }
            gettedSector!.active = false
            const result = await this.sectorDao.updateSector(gettedSector as SectorModel)
            this.logger.info(`✅ Sector was deleted soft with success`)
            return true
        } catch (error:any) {
            this.logger.error(`❌ Failed to delete soft sector: ${error.message}`)
            return false
        }
    }
    async getSectorById(sectorId: string): Promise<SectorModel | undefined> {
        if(!sectorId){
            this.logger.error(`❌ Required sector fields is empty: ${JSON.stringify(sectorId)}`)
            throw new CustomError(400, `❌ Required sector fields is empty: ${JSON.stringify(sectorId)}`)
        }
        try{
            const result = await this.sectorDao.getSectorById(sectorId)
            return result
        }catch(error:any){
            this.logger.error(`❌ Failed to update sector: ${error.message}`)
            throw new CustomError(500, error.message)
        }
    }
}

export {ISectorManagement, SectorManagement}