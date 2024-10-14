import { AttributeValue } from "@aws-sdk/client-dynamodb";
import {Logger} from "@aws-lambda-powertools/logger"

const logger = new Logger({
    logLevel:"debug"
})
interface IDynamoDBItem{
    toItem(): Record<string, unknown>;
    keys(): Record<string, unknown>;
    keysMap(): Record<string, AttributeValue>;
    get pk(): string;
    get sk(): string;
    get data(): Record<string, unknown>;
}

abstract class ItemModel implements IDynamoDBItem {
    abstract get pk(): string;
    abstract get sk(): string;
    abstract get data(): Record<string, unknown>;
    abstract toItem(): Record<string, unknown>;
    public entity: string = "ITEM";
  
    public keys(): Record<string, unknown> {
      return {
        PK: this.pk,
        SK: this.sk,
      };
    }
  
    public keysMap(): Record<string, AttributeValue> {
      return {
        PK: { S: this.pk },
        SK: { S: this.sk },
      };
    }
  }
  
  abstract class BaseEntity extends ItemModel {
    constructor(public id: string) {
      super();
      if (!id) {
        const errorMessage = "id is required for BaseEntity initialization";
        logger.error(`❌ BaseEntity initialization failed: ${errorMessage}`);
        throw new Error(errorMessage);
      }
      logger.debug(`✅ BaseEntity created with ID: ${id}`);
    }
  
    get pk(): string {
      return `${this.entity}#${this.id}`;
    }
  
    get sk(): string {
      return `${this.entity}#${this.id}`;
    }
  
    get data(): Record<string, unknown> {
      return this.toItem();
    }
  
    toItem(): Record<string, unknown> {
      return {
        ...this.keys(),
        ID: this.id,
        ENTITY: this.entity,
      };
    }
  }
  abstract class ActiveEntity extends BaseEntity {
    constructor(id: string, public active: boolean) {
      super(id);
    }
  
    toItem(): Record<string, unknown> {
      return {
        ...super.toItem(),
        active: this.active,
      };
    }
  }
export {BaseEntity, ActiveEntity, ItemModel}