const express=require('express')
const router=express.Router()

//organzation routes
const businessInfoRoute=require('./organzation/businessInfoRoute')
const BranchRoute=require('./organzation/BranchRoute')
const DepartmentRoute=require('./organzation/DepartmentRoute')
const PositionRoute=require('./organzation/PositionRoute')

//report route
const reportRoutes=require('./report/reportRoutes')

//auth
const AuthRoute=require('./AuthRoute')

router.use('/auth',AuthRoute)

router.use('/organzation/business',businessInfoRoute)
router.use('/organzation/branch',BranchRoute)
router.use('/organzation/department',DepartmentRoute)
router.use('/organzation/position',PositionRoute)

router.use('/reports', reportRoutes);

module.exports=router
