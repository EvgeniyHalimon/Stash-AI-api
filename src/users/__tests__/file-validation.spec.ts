import { ParseFilePipe, BadRequestException } from '@nestjs/common';
import { fileValidationPipe } from '../file-validation.pipe';

describe('File validation', () => {
  let parseFilePipe: ParseFilePipe;

  beforeEach(() => {
    parseFilePipe = fileValidationPipe;
  });

  it('should throw BadRequestException for invalid file type', async () => {
    const file = {
      mimetype: 'image/svg+xml',
      size: 1024,
      buffer: Buffer.from(''),
    };

    await expect(() => parseFilePipe.transform(file as any)).rejects.toThrow(
      new BadRequestException('Only jpg, jpeg, png, webp files are allowed'),
    );
  });

  it('should throw BadRequestException for file size exceeding the limit', async () => {
    const file = {
      mimetype: 'image/png',
      size: 5 * 1024 * 1024,
      buffer: Buffer.from(''),
    };

    await expect(() => parseFilePipe.transform(file as any)).rejects.toThrow(
      new BadRequestException('File should be 0.5mb or less'),
    );
  });

  it('should pass validation for valid file type and size', async () => {
    const file = {
      mimetype: 'image/png',
      size: 0.1 * 1024 * 1024,
      buffer: Buffer.from(''),
    };

    await expect(parseFilePipe.transform(file as any)).resolves.toEqual(file);
  });
});
