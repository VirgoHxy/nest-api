import { SetMetadata } from '@nestjs/common';

export const PACK_RESULT_KEY = 'packResult';
export const NotPackResult = () => SetMetadata(PACK_RESULT_KEY, false);
