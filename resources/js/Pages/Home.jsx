import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import ChatLayout from '@/Layouts/ChatLayout'
import React from 'react'

const Home = () => {
  return (
      <>
        home page
    </>
  )
}

Home.layout = (page) => {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Home
                </h2>
            }
        >
            <ChatLayout children={page}></ChatLayout>
        </AuthenticatedLayout>

    )
}

export default Home
