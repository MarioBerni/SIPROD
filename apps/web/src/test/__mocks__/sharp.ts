const mockSharp = jest.fn().mockReturnValue({
  resize: jest.fn().mockReturnThis(),
  webp: jest.fn().mockReturnThis(),
  avif: jest.fn().mockReturnThis(),
  jpeg: jest.fn().mockReturnThis(),
  toBuffer: jest.fn().mockResolvedValue(Buffer.from('mockImageBuffer')),
});

export default mockSharp;
