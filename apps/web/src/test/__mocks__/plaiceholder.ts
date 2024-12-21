export const getPlaiceholder = jest.fn().mockResolvedValue({
  base64: 'data:image/jpeg;base64,mockBase64String',
  css: { backgroundImage: 'mockCssString' },
});
