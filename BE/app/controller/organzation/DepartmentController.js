const db = require ('../../config/db');
// const sendMail = require('../helper/SendEmail');
const {PrismaClient} = require ('@prisma/client');
const bcrypt = require ('bcrypt');
const prisma = new PrismaClient ();

async function GenerateIdNo (prefixname) {
  // Get last id doc
  const lastDoc = await prisma.department.findFirst ({
    orderBy: {
      createdAt: 'desc',
    },
    take: 1,
  });

  if (!lastDoc) return prefixname;
  // Extract code and number
  const code = lastDoc.IDNO.split ('-')[0];
  let number = lastDoc.IDNO.split ('-')[1];

  // Increment number
  number = parseInt (number) + 1;

  // Pad with zeros
  number = number.toString ().padStart (5, '0');

  // Return new id
  return code + '-' + number;
}

exports.AllDepartment = async (req, res) => {
  try {
    const rawDepartments = await prisma.department.findMany({
      include: {
        branch: { select: { name: true } },
        positions: {
          include: { EmployeeWorkDetail: true },
        },
      },
    });

    const departments = rawDepartments.map((dep) => {
      // Calculate the total employee count by summing up EmployeeWorkDetail lengths across positions
      const employeeCount = dep.positions.reduce(
        (count, position) => count + position.EmployeeWorkDetail.length,
        0
      );

      return {
        id: dep.id,
        IDNO: dep.IDNO,
        name: dep.name,
        status: dep.status,
        createdAt: dep.createdAt,
        updatedAt: dep.updatedAt,
        branch: dep.branch.name,
        employees:employeeCount,  // Include the calculated employee count
      };
    });
    console.log(departments)

    return res.status(200).json({ departments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};


exports.FindDepartment = async (req, res) => {
  const {branchId} = req.query;
  try {
    const departments = await prisma.department.findMany ({
      where: {branchId: branchId},
    });
    return res.status (200).json ({departments});
  } catch (error) {
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.CloseDepartment = async (req, res) => {
  const {id} = req.query;
  try {
    const departments = await prisma.department.update ({
      where: {id: id},data:{status:'InActive'}
    });
    return res.status (200).json ({message:'Closed Department'});
  } catch (error) {
    console.log(error)
    return res.status (500).json ({message: 'Something went wrong'});
  }
};

exports.NewDepartment = async (req, res) => {
  const {name, branch} = req.body;

  try {
    const IDNO = await GenerateIdNo ('DPHR-00001');
    const FindDepName=await prisma.department.findFirst({where:{name:{contains:name},branchId:branch}})
    if (FindDepName) {
    return res.status (401).json ({message: 'Department Name Exist'});
    }
    await prisma.department.create ({
      data: {
        IDNO: IDNO,
        name,
        branch: {
          connect: {id: branch},
        },
      },
    });

    return res.status (200).json ({message: 'Branch Created'});
  } catch (error) {
    console.log (error);
    return res.status (500).json ({message: 'Sth Went Wrong'});
  }
};


exports.UpdateDepartment = async (req, res) => {
  const { id, name, branchId, status } = req.body;
  try {
    const updatedDepartment = await prisma.department.update({
      where: { IDNO: id },
      data: {
        name: name || undefined,  // Only update if provided
        branchId: branchId || undefined,
        status: status || undefined,
      },
    });

    return res.status(200).json({ message: 'Department Updated', department: updatedDepartment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.GetDepartmentById = async (req, res) => {
  const { id } = req.params;  
  console.log(req.params)
  try {
    const department = await prisma.department.findUnique({
      where: { IDNO: id },
      include: {
        branch: { select: { name: true } },
        positions: {
          include: { EmployeeWorkDetail: true },
        },
      },
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const employeeCount = department.positions.reduce(
      (count, position) => count + position.EmployeeWorkDetail.length,
      0
    );

    return res.status(200).json({
      id: department.id,
      IDNO: department.IDNO,
      name: department.name,
      status: department.status,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
      branch: department.branch.name,
      employees: employeeCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
