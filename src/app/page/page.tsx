"use client";

import ModalComponent from '@/app/ui/modal';
import { useState } from "react";
import { Button, Select, Table } from 'flowbite-react';

export default function Entry() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="grid">
      <h2 className="text-4xl font-extrabold dark:text-white">Title 123</h2>
      <h3 className="text-3xl font-extrabold dark:text-white">Explicación Técnica</h3>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam unde suscipit, exercitationem eveniet repellat soluta molestiae autem, quo harum provident, praesentium adipisci laborum debitis doloremque dolorum ut! Quas, ex veniam.</p>
      <h3 className="text-3xl font-extrabold dark:text-white">Explicación Ejemplificada</h3>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt perspiciatis rem tenetur ratione, mollitia deleniti magni rerum quasi voluptatem cum officia. Dolore culpa eveniet voluptatem praesentium suscipit? Consequuntur, possimus unde.</p>
      <h3 className="text-3xl font-extrabold dark:text-white">Tabla comparativa</h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <Table>
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">Framework</th>
              <th scope="col" className="px-6 py-3">Diferencias</th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800 ">Similitudes</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">Angular</th>
              <td className="px-6 py-4">Valor 1</td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">Valor 2</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">React</th>
              <td className="px-6 py-3">Valor 3</td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">Valor 4</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">Vue</th>
              <td className="px-6 py-3">Valor 5</td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">Valor 6</td>
            </tr>
          </tbody>
        </Table>
      </div>
      
      <h3 className="text-3xl font-extrabold dark:text-white">Referencia código</h3>
      <Button>Angular</Button>
      <Button>React</Button>
      <Button>Vue</Button>
      <h3 className="text-3xl font-extrabold dark:text-white">Comparación de código</h3>
      <form action="#">
        <label htmlFor="option1" defaultValue="1" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
        <Select>
          <option value="0">Choose a country</option>
          <option value="1">Angular</option>
          <option value="2">React</option>
          <option value="3">Vue</option>
        </Select>

        <label htmlFor="option2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
        <Select>
          <option value="0">Choose a country</option>
          <option value="1">Angular</option>
          <option value="2">React</option>
          <option value="3">Vue</option>
        </Select>
        <Button>Comparar</Button>
      </form>

      <Button onClick={() => setOpenModal(true)}>Toggle modal</Button>

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