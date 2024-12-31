const express=require('express')
const router=express.Router()
const BranchController=require('../../controller/organzation/BranchController') 
const auth=require('../../middleware/auth')


router.post('/new',BranchController.NewBranch)
router.get('/all',BranchController.AllBranch)
router.put('/edit',BranchController.UpdateBranch);
router.delete('/delete/:IDNO',BranchController.DeleteBranch);
router.get('/getById/:IDNO',BranchController.GetBranchByID)
router.get('/branches/search', BranchController.SearchBranchByName);

module.exports=router