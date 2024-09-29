import mongoose, { FilterQuery, ProjectionType, QueryOptions } from "mongoose";
import Product, { IProduct } from "../database/models/productModel.ts";
import config from "../config/config.ts";
import { IReview, IReviewer } from "../database/models/reviewModel.ts";
import rabbitMq from "../messaging/messageQueue.ts";

export interface ISortOption {
  [index: string]: QueryOptions<IProduct>;
}

export const sortOptions: ISortOption = {
  mostSold: { sort: { salesCount: -1 } },
};

export interface HomeCategory {
  heading: string;
  filter: FilterQuery<IProduct>;
  query: QueryOptions<IProduct>;
}


interface IPopulatedReview extends Omit<IReview, "productId" | "reviewerId"> {
  reviewer: IReviewer;
}

interface populatedProduct extends IProduct {
  reviews: Array<IPopulatedReview>;
}

interface UnPopulatedProduct extends IProduct {
  reviews: Array<IReview> | [];
}


export const aggregateProducts = async (
  filter: FilterQuery<IProduct> = {},
  projection: { [P in keyof IProduct]?: string | number } = {},
  query: QueryOptions = {}
): Promise<populatedProduct[] | UnPopulatedProduct[]> => {
  const products = await Product.aggregate<UnPopulatedProduct>([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "productId",
        as: "reviews",
        pipeline: [
          {
            $project: { __v: 0, updatedAt: 0, product: 0 },
          },
          {
            $limit: 5,
          },
        ],
      },
    },
    {
      $limit: query.limit || config.getProductConfig().limit,
    },
    {
      $project: Object.keys(projection).length > 0 ? projection : { __v: 0 },
    },
    {
      $sort: query.sort || { title: -1 },
    },
  ]);

  const reviewerIds = products
    .map((product) =>
      product.reviews.map((review) => review.reviewerId?.toString())
    )
    .flat();

  if (reviewerIds.length === 0) return products;

  const reviewersData = await rabbitMq.rpcRequest(
    "user.profile.get",
    reviewerIds
  );

  const reviewersProfiles = JSON.parse(reviewersData) as IReviewer[];
  const profilesMap = createReviewerProfilesMapWithIds(reviewersProfiles);

  return populateReviewsWithReviewerProfiles(products, profilesMap);
};

function populateReviewsWithReviewerProfiles(
  products: UnPopulatedProduct[],
  profilesMap: Map<string, IReviewer>
): populatedProduct[]  {
  
  const populatedProducts: populatedProduct[] = products.map((product) => {
    const populatedReviews = product.reviews
      .map((review) => {
        const reviewerId: string = review.reviewerId.toString();
        const reviewer = profilesMap.get(reviewerId);
        if (!reviewer) return null;
        return {
          content: review.content,
          images: review.images,
          stars: review.stars,
          reviewer: profilesMap.get(reviewerId),
        } as IPopulatedReview;
      }).filter((review): review is IPopulatedReview => review !== null);
    
    const {reviews, ...baseProduct } = product;
    return {
      ...baseProduct,
      reviews: populatedReviews,
    };
  });

  return populatedProducts;
}

function createReviewerProfilesMapWithIds(reviewersProfiles: IReviewer[]) {
  const profilesMap = new Map<string, IReviewer>();
  reviewersProfiles.forEach((reviewer) =>
    profilesMap.set(reviewer._id, reviewer)
  );
  return profilesMap;
}


export const homeCategories: Array<HomeCategory> = [
  {
    heading: "Premium Cars",
    filter: { category: "cars" },
    query: {
      sort: { price: 1 },
      limit: config.getProductConfig().limit,
    },
  },
  {
    heading: "Featured Trucks",
    filter: { category: "trucks" },
    query: {
      sort: { salesCount: -1 },
      limit: config.getProductConfig().limit,
    },
  },
];
