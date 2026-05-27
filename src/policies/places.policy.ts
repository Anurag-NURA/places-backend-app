import type { User, Place } from '../generated/prisma/client';

export class PlacePolicy {
  static canModify(user: User, place: Place): boolean {
    return user.id === place.creatorId;
  }

  static canDelete(user: User, place: Place): boolean {
    return user.id === place.creatorId;
  }
}
