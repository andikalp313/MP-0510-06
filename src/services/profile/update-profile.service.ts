import { cloudinaryRemove, cloudinaryUpload } from "../../lib/cloudinary";
import prisma from "../../lib/prisma";

interface UpdateUserBody {
  name: string;
  organizerName:string;
  email:string;
  address:string;
  profilePicture: string;
}

export const updateProfileService = async (
  body: UpdateUserBody,
  profilePicture: Express.Multer.File | undefined,
  id: number
) => {
  try {
    console.log(body, profilePicture, id);

    const user = await prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new Error("Invalid user id");
    }

    let secure_url: string | undefined;
    if (profilePicture) {
      if (user.profilPicture !== null) {
        await cloudinaryRemove(user.profilPicture);
      }

      const uploadResult = await cloudinaryUpload(profilePicture);
      secure_url = uploadResult.secure_url;
    }

    await prisma.user.update({
      where: { id },
      data: secure_url ? { ...body, profilePicture: secure_url } : body,
    });

    return { message: "Update profile success" };
  } catch (error) {
    throw error;
  }
};