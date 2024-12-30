const express=require('express')
const router=express.Router()
const DepartmentController=require('../../controller/organzation/DepartmentController') 
const auth=require('../../middleware/auth')

router.post('/new',DepartmentController.NewDepartment)
router.get('/close',DepartmentController.CloseDepartment)
router.get('/all',DepartmentController.AllDepartment)
router.get('/find',DepartmentController.FindDepartment)

module.exports=router