import { Injectable } from '@nestjs/common';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

@Injectable()
export class UploadsService {
  saveLocal(filename: string, buffer: Buffer) {
    const uploadsDir = 'apps/server/uploads';
    if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });
    const path = `${uploadsDir}/${Date.now()}-${filename}`;
    writeFileSync(path, buffer);
    return path;
  }
}


