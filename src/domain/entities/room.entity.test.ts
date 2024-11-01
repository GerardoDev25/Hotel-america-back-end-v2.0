import { Uuid } from '@src/adapters';
import { RoomEntity } from './room.entity';
import { IRoom } from '../interfaces';

describe('room.entity.ts', () => {
  const validObject: IRoom = {
    id: Uuid.v4(),
    roomType: 'suit',
    state: 'free',
    roomNumber: 101,
    betsNumber: 2,
    isAvailable: true,
  };
  test('should return RoomEntity instance when given valid object properties', () => {
    // Arrange
    const expectedRoomEntity = new RoomEntity({
      id: validObject.id,
      roomType: 'suit',
      state: validObject.state,
      roomNumber: 101,
      betsNumber: 2,
      isAvailable: true,
    });

    // Act
    const result = RoomEntity.fromObject(validObject);

    // Assert
    expect(result).toEqual(expectedRoomEntity);
  });

  test('should throw error if invalid properties', () => {
    // Arrange
    const idInvalid = '';
    const roomTypeInvalid = 'invalid';
    const roomNumberInvalid = '101a';
    const stateInvalid = '101a';
    const betsNumberInvalid = '2a';
    const isAvailableInvalid = '';

    // Act & Assert
    expect(() =>
      RoomEntity.fromObject({ ...validObject, id: idInvalid })
    ).toThrow();

    expect(() =>
      RoomEntity.fromObject({ ...validObject, state: stateInvalid })
    ).toThrow();

    expect(() =>
      RoomEntity.fromObject({ ...validObject, roomType: roomTypeInvalid })
    ).toThrow();
    expect(() =>
      RoomEntity.fromObject({ ...validObject, roomNumber: roomNumberInvalid })
    ).toThrow();
    expect(() =>
      RoomEntity.fromObject({ ...validObject, betsNumber: betsNumberInvalid })
    ).toThrow();
    expect(() =>
      RoomEntity.fromObject({
        ...validObject,
        isAvailable: isAvailableInvalid,
      })
    ).toThrow();
  });
});
