import User from '../models/User.js'

//Create new User
const createUser = async (req, res) => {
  const { fname, lname, email, mobile, referBy, region } = req.body;

  const user = await User.create({
    fname,
    lname,
    email,
    mobile,
    referBy,
    region,
  });

  if (!user) {
    throw new ApiErrors(500, "Something went wrong in creating user");
  }

  return res.status(201).json(new ApiResponses(201, user, "User created Successfully"));
};
//Update User
export const updateUser = async (req, res) => {
   const id = req.params.id

   try {
      const updatedUser = await User.findByIdAndUpdate(id, {
         $set: req.body
      }, { new: true })

      res.status(200).json({ success: true, message: 'Successfully updated', data: updatedUser })
   } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update' })
   }
}

//Delete User
export const deleteUser = async (req, res) => {
   const id = req.params.id

   try {
      await User.findByIdAndDelete(id)

      res.status(200).json({ success: true, message: 'Successfully deleted' })
   } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete' })
   }
}

//Get single User
export const getSingleUser = async (req, res) => {
   const id = req.params.id

   try {
      const user = await User.findById(id)

      res.status(200).json({ success: true, message: 'Successfully', data: user })
   } catch (error) {
      res.status(404).json({ success: false, message: 'Not Found' })
   }
}

//GetAll User
export const getAllUser = async (req, res) => {
   //console.log(page)

   try {
      const users = await User.find({})

      res.status(200).json({ success: true, message: 'Successfully', data: users })
   } catch (error) {
      res.status(404).json({ success: false, message: 'Not Found' })
   }
}