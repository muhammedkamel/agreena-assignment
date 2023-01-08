import { format } from "date-fns";
import { FindOperator, LessThan, MoreThan } from "typeorm";

export const MoreThanDate = (date: Date): FindOperator<string> => MoreThan(format(date, "yyyy-MM-dd HH:mm:ss"))
export const LessThanDate = (date: Date): FindOperator<string> => LessThan(format(date, "yyyy-MM-dd HH:mm:ss"))
