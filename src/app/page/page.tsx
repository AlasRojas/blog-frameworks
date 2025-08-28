export default function Entry() {
  return (
    <div>
      <h2>Title 123</h2>
      <h3>Explicación Técnica</h3>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam unde suscipit, exercitationem eveniet repellat soluta molestiae autem, quo harum provident, praesentium adipisci laborum debitis doloremque dolorum ut! Quas, ex veniam.</p>
      <h3>Explicación Ejemplificada</h3>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt perspiciatis rem tenetur ratione, mollitia deleniti magni rerum quasi voluptatem cum officia. Dolore culpa eveniet voluptatem praesentium suscipit? Consequuntur, possimus unde.</p>
      <h3>Tabla comparativa</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Diferencias</th>
            <th>Similitudes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Angular</th>
            <td>Valor 1</td>
            <td>Valor 2</td>
          </tr>
          <tr>
            <th>React</th>
            <td>Valor 3</td>
            <td>Valor 4</td>
          </tr>
          <tr>
            <th>Vue</th>
            <td>Valor 5</td>
            <td>Valor 6</td>
          </tr>
        </tbody>
      </table>
      <h3>Referencia código</h3>
      <button>Angular</button>
      <button>React</button>
      <button>Vue</button>
      <h3>Comparación de código</h3>
      <form action="#">
      <select name="option1">
          <option value="1">Angular</option>
          <option value="2">React</option>
          <option value="3">Vue</option>
        </select>
        <select name="option2">
          <option value="1">Angular</option>
          <option value="2">React</option>
          <option value="3">Vue</option>
        </select>
        <button>Comparar</button>
      </form>
    </div>
  );
}