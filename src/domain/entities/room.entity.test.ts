import { RoomEntity } from './room.entity';

describe('room.entity.ts', () => {
  const validObject = {
    id: 'abc',
    roomType: 'suit',
    roomNumber: '101',
    betsNumber: '2',
    isAvailable: 'true',
  };
  test('should return RoomEntity instance when given valid object properties', () => {
    // Arrange
    const expectedRoomEntity = new RoomEntity({
      id: 'abc',
      roomType: 'suit',
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
    const betsNumberInvalid = '2a';
    const isAvailableInvalid = '';

    // Act & Assert
    expect(() =>
      RoomEntity.fromObject({ ...validObject, id: idInvalid })
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
      RoomEntity.fromObject({ ...validObject, isAvailable: isAvailableInvalid })
    ).toThrow();
  });
});
