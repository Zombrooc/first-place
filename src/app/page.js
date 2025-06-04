// import { getClassificationsFromDB } from "./_actions/classificationActions";

import ClassificationClientPage from "./page-client";

export default async function HomePage() {

  // const { classificationStatus, classifications } = await getClassificationsFromDB();

  // console.log(JSON.stringify({ classificationStatus, classifications }))

  return (
    <>
      {/* <ClassificationClientPage classificationStatus={classificationStatus} classifications={classifications} /> */}
      <ClassificationClientPage />
    </>
  )
}