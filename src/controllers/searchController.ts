import { NextFunction, Request, Response } from 'express';
import SearchService from '../services/searchService';
import { ValidationError } from '../utils/errorClass';
import { HttpStatus } from '../utils/httpStatus';
import ResponseModel from '../utils/responseModel';

class SearchController {
  static async searchAll(req: Request, res: Response, next: NextFunction) {
    try {
      const pattern = req.query.pattern as string;

      const DEFAULT_LIMIT = 5;
      const MAX_LIMIT = 100;
      const DEFAULT_OFFSET = 0;
      const MAX_OFFSET = 1000;

      const limit =
        req.query.limit !== undefined ? Number(req.query.limit) : DEFAULT_LIMIT;
      const offset =
        req.query.offset !== undefined
          ? Number(req.query.offset)
          : DEFAULT_OFFSET;

      if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
        throw new ValidationError(
          `Limit must be a positive integer between 1 and ${MAX_LIMIT}.`
        );
      }
      if (!Number.isInteger(offset) || offset < 0 || offset > MAX_OFFSET) {
        throw new ValidationError(
          `Offset must be a integer between 0 and ${MAX_OFFSET}.`
        );
      }

      const result = await SearchService.searchAll(pattern, limit, offset);
      ResponseModel.send(res, HttpStatus.OK, result);
    } catch (error) {
      next(error);
    }
  }
}

export default SearchController;
