import { randomUUID } from "crypto";
import { Logger } from "@aws-lambda-powertools/logger";
import { CustomError } from "../../utils/feedback-util"
 // Path to the SectorModel class
import { ActiveEntity } from "../../models/base"; // Path to ActiveEntity
import { SectorModel } from "../../models/sector";
import { unmarshall } from "@aws-sdk/util-dynamodb";


describe('SectorModel', () => {
  let sector: SectorModel;

  beforeEach(() => {
    sector = new SectorModel(
      "12345", 
      "Test Sector", 
      "Description of sector", 
      "Active", 
      true
    );
  });

  it('should create an instance of SectorModel with provided values', () => {
    expect(sector.id).toBe("12345");
    expect(sector.name).toBe("Test Sector");
    expect(sector.description).toBe("Description of sector");
    expect(sector.status).toBe("Active");
    expect(sector.active).toBe(true);
    expect(sector.entity).toBe("SECTOR");
  });

  it('should create an instance with random UUID when id is not provided', () => {
    const sectorWithoutId = new SectorModel(undefined, "Another Sector");
    expect(sectorWithoutId.id).not.toBeUndefined();
    expect(sectorWithoutId.id).not.toBe("12345");
  });

  it('should return the correct partition key (pk) and sort key (sk)', () => {
    const expectedPk = `SECTOR#12345`;
    const expectedSk = `SECTOR#12345`;
    expect(sector.pk).toBe(expectedPk);
    expect(sector.sk).toBe(expectedSk);
  });

  it('should return a valid item using toItem()', () => {
    const item = unmarshall(sector.toItem());
    expect(item.PK).toBe(`SECTOR#12345`);
    expect(item.SK).toBe(`SECTOR#12345`);
    expect(item.data).toEqual({
      id: "12345",
      name: "Test Sector",
      description: "Description of sector",
      status: "Active",
      active: true,
    });
  });

  it('should handle invalid item in fromItem()', () => {
    const invalidItem = { data: null };
    try {
      SectorModel.fromItem(invalidItem);
    } catch (error:any) {
      expect(error).toBeInstanceOf(CustomError);
      expect(error.message).toBe("❌ Invalid item received: [object Object]");
    }
  });

  it('should handle missing data in fromItem()', () => {
    const invalidItem = {};
    try {
      SectorModel.fromItem(invalidItem);
    } catch (error:any) {
      expect(error).toBeInstanceOf(CustomError);
      expect(error.message).toBe("❌ Invalid item received: [object Object]");
    }
  });

  it('should create a new sector from a valid input using fromInput()', () => {
    const sectorInput = {
      id: "67890",
      name: "New Sector",
      description: "New description",
      status: "Inactive",
      active: false
    };

    const newSector = SectorModel.fromInput(sectorInput);
    expect(newSector.id).toBe("67890");
    expect(newSector.name).toBe("New Sector");
    expect(newSector.description).toBe("New description");
    expect(newSector.status).toBe("Inactive");
    expect(newSector.active).toBe(false);
  });

  it('should throw error when invalid input is passed to fromInput()', () => {
    const invalidInput = null;
    try {
      SectorModel.fromInput(invalidInput as any); // Invalid input type
    } catch (error:any) {
      expect(error).toBeInstanceOf(CustomError);
      expect(error.message).toBe("❌ Invalid SectorInput received: null");
    }
  });

  it('should correctly call the logger in case of an invalid input or item', () => {
    const loggerErrorSpy = jest.spyOn(Logger.prototype, 'error');
    
    const invalidItem = { data: null };
    try {
      SectorModel.fromItem(invalidItem);
    } catch (error) {
      expect(loggerErrorSpy).toHaveBeenCalledWith("❌ Invalid item received: [object Object]");
    }

    const invalidInput = null;
    try {
      SectorModel.fromInput(invalidInput as any);
    } catch (error) {
      expect(loggerErrorSpy).toHaveBeenCalledWith("❌ Invalid SectorInput received: null");
    }
  });
});
