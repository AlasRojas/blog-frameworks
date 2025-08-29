"use client";

import ModalComponent from '@/app/ui/modal';
import { useState } from "react";
import { Button, Select, Table } from 'flowbite-react';

export default function Entry() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <h1 className="text-5xl font-extrabold mb-8 text-center text-blue-700 dark:text-blue-400 border-b-2 border-blue-200 pb-4">Title 123</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white border-l-4 border-blue-500 pl-3">Explicación Técnica</h2>
          <p className="text-justify text-gray-700 dark:text-gray-300 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam unde suscipit, exercitationem eveniet repellat soluta molestiae autem, quo harum provident, praesentium adipisci laborum debitis doloremque dolorum ut! Quas, ex veniam.
          </p>
        </div>
        
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white border-l-4 border-green-500 pl-3">Explicación Ejemplificada</h2>
          <p className="text-justify text-gray-700 dark:text-gray-300 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt perspiciatis rem tenetur ratione, mollitia deleniti magni rerum quasi voluptatem cum officia. Dolore culpa eveniet voluptatem praesentium suscipit? Consequuntur, possimus unde.
          </p>
        </div>
      </div>
      
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white border-l-4 border-purple-500 pl-3">Tabla comparativa</h2>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <Table striped hoverable>
            <thead>
              <tr>
                <th className="bg-gray-100 dark:bg-gray-800">Framework</th>
                <th>Diferencias</th>
                <th className="bg-gray-100 dark:bg-gray-800">Similitudes</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              <tr className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <td className="whitespace-nowrap font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700">Angular</td>
                <td>Valor 1</td>
                <td className="bg-gray-50 dark:bg-gray-700">Valor 2</td>
              </tr>
              <tr className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <td className="whitespace-nowrap font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700">React</td>
                <td>Valor 3</td>
                <td className="bg-gray-50 dark:bg-gray-700">Valor 4</td>
              </tr>
              <tr className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <td className="whitespace-nowrap font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700">Vue</td>
                <td>Valor 5</td>
                <td className="bg-gray-50 dark:bg-gray-700">Valor 6</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
      
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white border-l-4 border-yellow-500 pl-3">Referencia código</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button color="blue" className="w-auto px-6">Angular</Button>
          <Button color="green" className="w-auto px-6">React</Button>
          <Button color="purple" className="w-auto px-6">Vue</Button>
        </div>
      </div>
      
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white border-l-4 border-red-500 pl-3">Comparación de código</h2>
        <form className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="option1" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seleccionar framework 1</label>
              <Select id="option1" className="w-full">
                <option value="0">Seleccionar framework</option>
                <option value="1">Angular</option>
                <option value="2">React</option>
                <option value="3">Vue</option>
              </Select>
            </div>
            
            <div>
              <label htmlFor="option2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seleccionar framework 2</label>
              <Select id="option2" className="w-full">
                <option value="0">Seleccionar framework</option>
                <option value="1">Angular</option>
                <option value="2">React</option>
                <option value="3">Vue</option>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button color="blue" className="w-auto px-8">Comparar</Button>
          </div>
        </form>
      </div>

      <div className="flex justify-center mt-8">
        <Button color="purple" className="w-auto px-8" onClick={() => setOpenModal(true)}>Abrir modal</Button>
      </div>

      <ModalComponent isOpen={openModal} handleClose={(value) => setOpenModal(value)}>
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
            companies around the world are updating their terms of service agreements to comply.
          </p>
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant
            to ensure a common set of data rights in the European Union. It requires organizations to notify users as
            soon as possible of high-risk data breaches that could personally affect them.
          </p>
        </div>
      </ModalComponent>


    </div>
  );
}