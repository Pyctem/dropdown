import { Dropdown } from "./Dropdown";

function App() {
  return (
    <div className={'container'}>
      <div className={'anyblock'} />
      <Dropdown
        className="dropdown"
        value="Test 15"
        defaultValue="Test 15"
        label="label"
        icon="icon"
        disabled={false}
        onChange={() => console.log('change')}
      >
        {(new Array(33)).fill(1).map((item, key) => (
          <Dropdown.Option key={key} value={`Test ${key + 1}`} className="option" disabled={false}>
            {`Test ${key + 1}`}
          </Dropdown.Option>
        ))}
      </Dropdown>
      <div className={'anyblock'} />
    </div>
  );
}

export default App;
