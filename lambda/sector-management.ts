import { Logger } from "@aws-lambda-powertools/logger";
import { SectorModel } from "./models/sector";


interface ISectorManager{
    createSector(sector:SectorModel):Promise<SectorModel>;
    updateSector(sector:SectorModel):Promise<SectorModel>;
    deleteSector(id:string, isSoft:boolean):Promise<Boolean>;
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
        this.logger.info(`🔁 Initing creating sector: ${JSON.stringify(sector.id)}`)
    }
    async updateSector(sector: SectorModel): Promise<SectorModel> {
        this.logger.info(`🔁 Initing updating sector: ${JSON.stringify(sector.id)}`)
    }
    async deleteSector(id: string, isSoft:booelan): Promise<Boolean> {
        this.logger.info(`🔁 Initing deleting sector: ${JSON.stringify(id)}`)
    }
    deleteSectorSoft(sector:SectorModel): Promise<SectorModel> {
        this.logger.info(`🔁 Initing deleting soft sector: ${JSON.stringify(sector.id)}`)
    }
    async getSectorById(id: string): Promise<SectorModel> {
        this.logger.info(`🔁 Initing creating sector: ${JSON.stringify(sector.id)}`)
    }

}