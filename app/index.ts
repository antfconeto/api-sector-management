/**
 * @fileoverview
 * Location: lambda/index.ts
 */

// ---------- 1. Imports ----------
import { Logger } from "@aws-lambda-powertools/logger";
import { SectorModel } from "./models/sector";
import {
  ISectorManagement,
  SectorManagement,
} from "./service/sector-management";

// Initialize the logger
const logger = new Logger({
  serviceName: "index",
  logLevel: "debug",
});

// ---------- 3. Type Definitions ----------
type AppSyncEvent = {
  info: {
    fieldName: string;
    selectionSetList: string[];
  };
  arguments: {
    sector: SectorInput;
    sectorId: string;
    isSoft: boolean;
  };
  identity: {
    username: string;
  };
};

// ---------- 4. Interfaces ----------
// ---------- 5. Classes ----------
const sectorManager: ISectorManagement = new SectorManagement();
// ---------- 6. Functions ----------
const handler = async (event: AppSyncEvent) => {
  logger.info(`🎫 Received event: ${JSON.stringify(event)}`);

  if (isAppSyncEvent(event)) {
    try {
      if (!event || !event.info || !event.info.fieldName) {
        logger.error("❌ Event structure is not valid or fieldName is missing");
        throw new Error(
          "❌ Event structure is not valid or fieldName is missing"
        );
      }
      const { fieldName } = event.info;
      logger.info(`🧤 Handling request for field: ${fieldName}`);
      switch (fieldName) {
        //Sector related cases
        case "createSector":
          return await sectorManager.createSector(
            SectorModel.fromInput(event.arguments.sector)
          );
        case "getSectorById":
          return await sectorManager.getSectorById(event.arguments.sectorId);
        case "deleteSector":
          return await sectorManager.deleteSector(
            event.arguments.sectorId,
            event.arguments.isSoft
          );
        case "updateSector":
          return await sectorManager.updateSector(
            SectorModel.fromInput(event.arguments.sector)
          );
        default:
          /* return null; */
          throw new Error(` ❌Unhandled fieldName: ${fieldName}`);
      }
    } catch (error) {
      logger.error("❌ Error handling the request", { error });
      throw error;
    }
  } else {
    throw new Error("Not Appsync Event");
  }
};

function isAppSyncEvent(event: any): event is AppSyncEvent {
  return (event as AppSyncEvent).info !== undefined;
}

export { handler, isAppSyncEvent };
