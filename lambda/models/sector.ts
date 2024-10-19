import { randomUUID } from "crypto";
import { ActiveEntity } from "./base";
import { Logger } from "@aws-lambda-powertools/logger";
import { CustomError } from "../utils/feedback-util";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import {marshall} from "@aws-sdk/util-dynamodb"
const logger = new Logger({
  logLevel: "debug",
  serviceName: "SectorModel",
});
/**
 * Represents a sector entity with properties and methods for managing its data.
 * Extends the ActiveEntity class to include active status functionality.
 */
class SectorModel extends ActiveEntity {
    public id: string;
    public name: string;
    public description: string;
    public status: string;
    public entity: string;
    public active: boolean;
  
    /**
     * Constructs a new SectorModel instance.
     * 
     * @param id - The unique identifier for the sector. If not provided, a random UUID is generated.
     * @param name - The name of the sector. Defaults to an empty string if not provided.
     * @param description - A brief description of the sector. Defaults to an empty string if not provided.
     * @param status - The current status of the sector. Defaults to an empty string if not provided.
     * @param active - Indicates whether the sector is active. Defaults to false if not provided.
     */
    constructor(
      id?: string,
      name?: string,
      description?: string,
      status?: string,
      active?: boolean
    ) {
      super(id || randomUUID(), active || false);
      this.id = id || randomUUID();
      this.description = description || "";
      this.name = name || "";
      this.status = status || "";
      this.active = active || false;
      this.entity = "SECTOR";
    }
  
    /**
     * Gets the partition key for the sector.
     * 
     * @returns A string representing the partition key.
     */
    get pk() {
      return `${this.entity}#${this.id}`;
    }
  
    /**
     * Gets the sort key for the sector.
     * 
     * @returns A string representing the sort key.
     */
    get sk() {
      return `${this.entity}#${this.id}`;
    }
  
    /**
     * Converts the SectorModel instance to a DynamoDB item format.
     * 
     * @returns An object representing the sector in DynamoDB item format.
     */
    toItem(): Record<string, AttributeValue> {
      logger.info(`🔁 Converting SectorModel to item`);
      return marshall({
        PK: this.pk,
        SK: this.sk,
        data: {
          id: this.id,
          status: this.status,
          description: this.description,
          name: this.name,
          active: this.active,
        },
        entity: this.entity
      });
    }
  
    /**
     * Creates a SectorModel instance from a DynamoDB item.
     * 
     * @param item - The DynamoDB item to convert.
     * @returns A new SectorModel instance.
     * @throws CustomError if the item is invalid.
     */
    fromItem(item: any) {
      logger.info(`🔁 Converting item to SectorModel`);
      if (!item || !item.data) {
        logger.error(`❌ Invalid item received: ${item}`);
        throw new CustomError(500, `❌ Invalid item received: ${item}`);
      }
      const { active, name, description, status, id } = item.data as SectorModel;
      return new SectorModel(id, name, description, status, active);
    }
  
    /**
     * Creates a SectorModel instance from a SectorInput object.
     * 
     * @param sectorInput - The input object containing sector data.
     * @returns A new SectorModel instance.
     * @throws CustomError if the input is invalid.
     */
    fromInput(sectorInput: SectorInput) {
      logger.info(`🔁 Converting SectorInput to SectorModel`);
      if (!sectorInput) {
        logger.error(`❌ Invalid SectorInput received: ${sectorInput}`);
        throw new CustomError(
          500,
          `❌ Invalid SectorInput received: ${sectorInput}`
        );
      }
      return new SectorModel(
        sectorInput.id,
        sectorInput.name,
        sectorInput.description,
        sectorInput.status,
        sectorInput.active
      );
    }
  }
export {SectorModel}