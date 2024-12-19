import { Prisma } from "@prisma/client";

import { PaginationQueryParams } from "../../types/pagination";
import { prisma } from "../../lib/prisma";

interface GetEventQuery extends PaginationQueryParams {
  search?: string;
  location?: string;
  category: string;
}

export const getEventsService = async (query: GetEventQuery) => {
  try {
    const { page, sortBy, sortOrder, take, search, category, location } = query;

    const whereClause: Prisma.EventWhereInput = {
      deletedAt: null,
    };

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { eventCategory: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      whereClause.eventCategory = category;
    }

    if (location) {
      whereClause.location = { contains: location, mode: "insensitive" };
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      skip: (page - 1) * take, //offset
      take: take, //limit
      orderBy: { [sortBy]: sortOrder }, // sorting
    });

    const count = await prisma.event.count({ where: whereClause });

    return {
      data: events,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
