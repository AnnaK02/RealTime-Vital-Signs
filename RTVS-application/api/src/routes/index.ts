import { Router } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();
const moduleDir = path.join(__dirname, '../modules');
let modulePath: string;

fs.readdirSync(moduleDir)
  .forEach((moduleFolder: any) => {
    modulePath = path.join(moduleDir, moduleFolder);

    fs.readdirSync(modulePath)
      .forEach((file: string) => {
        if (file.endsWith('routes.ts')) {
          import(path.join(modulePath, file)).then(
            ({ default: module }) =>{
              module.default(router)
            }
          );
        }
      });
  });

export default router;
