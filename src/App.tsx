import React, { useContext, useReducer, memo, useState } from "react";

const AppContext = React.createContext({
  toggled: false,
  toggleValue: (): void => {
    throw new Error("toggleValue not implemented");
  },
  memoizeTree: false,
  toggleMemoizeTree: (): void => {
    throw new Error("toggleMemoizeTree not implemented");
  },
});

const AppContextProvider: React.FC = ({ children }) => {
  const [toggled, toggleValue] = useReducer((isToggled: boolean) => !isToggled, false);
  const [memoizeTree, toggleMemoizeTree] = useReducer((isMemo: boolean) => !isMemo, true);

  return (
    <AppContext.Provider value={{ toggled, toggleValue, memoizeTree, toggleMemoizeTree }}>
      {children}
    </AppContext.Provider>
  );
};

const DeepTreeContext = React.createContext({
  depth: 0,
  label: "deep tree",
  toggleValue: (): void => {
    throw new Error("toggleValue not implemented");
  },
});

interface DeepTreeProps {
  toggleValue: () => void;
  label: string;
  depth: number;
}

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <MemoToggle />
      <ToggleMonitor />
      <DeepTreeApp />
    </AppContextProvider>
  );
};

const DeepTreeApp: React.FC = () => {
  const { toggleValue, memoizeTree } = useContext(AppContext);
  const Tree = memoizeTree ? DeepTreeTogglerMemo : DeepTreeToggler;

  const [aboveDepth, setAboveDepth] = useState(3);
  const [belowDepth, setBelowDepth] = useState(6);

  return (
    <div>
      <DepthSelector depth={aboveDepth} onChange={setAboveDepth} />
      <Tree label="above" depth={aboveDepth} toggleValue={toggleValue} />

      <DepthSelector depth={belowDepth} onChange={setBelowDepth} />
      <Tree label="below" depth={belowDepth} toggleValue={toggleValue} />
    </div>
  );
};

const DepthSelector: React.FC<{
  depth: number;
  onChange: (newDepth: number) => void;
}> = ({ depth, onChange }) => {
  return (
    <div>
      {depth}
      <input
        type="range"
        min="0"
        max="100"
        onChange={event => onChange(parseInt(event.target.value))}
        value={depth}
      ></input>
    </div>
  );
};

const DeepTreeToggler: React.FC<DeepTreeProps> = ({ toggleValue, label, depth }) => {
  return (
    <DeepTreeContext.Provider value={{ toggleValue, label, depth }}>
      <Toggler />
      <DeepTree />
    </DeepTreeContext.Provider>
  );
};

const DeepTreeTogglerMemo = memo(DeepTreeToggler);

const DeepTree: React.FC = () => {
  const { label, depth } = useContext(DeepTreeContext);

  return Array.from({ length: depth }, (_, i) => i).reduce(
    (nested, level) => {
      return <Nester level={level}>{nested}</Nester>;
    },
    <>
      {label} (<ToggleMonitor />)
    </>
  );
};

interface NesterProps {
  level: number;
}

const Nester: React.FC<NesterProps> = ({ children, level }) => {
  const { label, depth } = useContext(DeepTreeContext);

  return (
    <div className="nested-component">
      level: {level}, label: {label}, tree depth: {depth}
      {children}
    </div>
  );
};

const Toggler: React.FC = () => {
  const { toggleValue, label } = useContext(DeepTreeContext);
  return <button onClick={() => toggleValue()}>Toggle from {label}</button>;
};

const ToggleMonitor: React.FC = () => {
  const { toggled } = useContext(AppContext);

  return <div>{toggled ? "toggled" : "not toggled"}</div>;
};

const MemoToggle: React.FC = () => {
  const { memoizeTree, toggleMemoizeTree } = useContext(AppContext);
  return (
    <div>
      <input
        type="checkbox"
        checked={memoizeTree}
        id="memo-tree"
        onChange={toggleMemoizeTree}
      />
      <label htmlFor="memo-tree">Memoize Tree</label>
    </div>
  );
};

export default App;
