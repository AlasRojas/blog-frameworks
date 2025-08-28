export default function Entry() {
  return (
    <div className="grid">
      <h2 className="text-4xl font-extrabold dark:text-white">Title 123</h2>
      <h3 className="text-3xl font-extrabold dark:text-white">Explicación Técnica</h3>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam unde suscipit, exercitationem eveniet repellat soluta molestiae autem, quo harum provident, praesentium adipisci laborum debitis doloremque dolorum ut! Quas, ex veniam.</p>
      <h3 className="text-3xl font-extrabold dark:text-white">Explicación Ejemplificada</h3>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt perspiciatis rem tenetur ratione, mollitia deleniti magni rerum quasi voluptatem cum officia. Dolore culpa eveniet voluptatem praesentium suscipit? Consequuntur, possimus unde.</p>
      <h3 className="text-3xl font-extrabold dark:text-white">Tabla comparativa</h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
        </table>
      </div>
      
      <h3 className="text-3xl font-extrabold dark:text-white">Referencia código</h3>
      <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Angular</button>
      <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">React</button>
      <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Vue</button>
      <h3 className="text-3xl font-extrabold dark:text-white">Comparación de código</h3>
      <form action="#">
        <label htmlFor="option1" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
        <select id="option1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option selected>Choose a country</option>
          <option value="1">Angular</option>
          <option value="2">React</option>
          <option value="3">Vue</option>
        </select>

        <label htmlFor="option2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
        <select id="option2" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option selected>Choose a country</option>
          <option value="1">Angular</option>
          <option value="2">React</option>
          <option value="3">Vue</option>
        </select>
        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Comparar</button>
      </form>
    </div>
  );
}