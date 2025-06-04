'use server'

import { prisma } from '@/lib/prisma'

const addNewClassificationToDB = async ({ selectedFile, csvContent }) => {

  // {
  //   fileName: selectedFile.name,
  //     fileSize: selectedFile.size,
  //       csvContent,
  //       },

  const newClassification = await prisma.classification.create({
    data: {
      csvContent,
      fileName: selectedFile.name,
      fileSize: selectedFile.size
    }
  })

  return {
    success: true,
    classification: newClassification
  }
}

const getClassificationsFromDB = async () => {
  const classifications = await prisma.classification.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  console.log('Classifications fetched from DB:', classifications[0]);

  return {
    success: true,
    classifications
  };
}

export { addNewClassificationToDB, getClassificationsFromDB }