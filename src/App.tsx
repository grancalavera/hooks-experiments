import React, { useContext, useReducer, memo } from "react";

const AppContext = React.createContext({
  loading: false,
  aboveTreeDepth: 0,
  belowTreeDepth: 0,
  toggleLoading: (): void => {
    throw new Error("toggleLoading not implemented");
  },
});

const DeepTreeContext = React.createContext({
  depth: 0,
  label: "deep tree",
  toggleLoading: (): void => {
    throw new Error("toggleLoading not implemented");
  },
});

const AppContextProvider: React.FC = ({ children }) => {
  const [loading, toggleLoading] = useReducer((isLoading: boolean) => !isLoading, false);

  const aboveTreeDepth = 0;
  const belowTreeDepth = 10;

  return (
    <AppContext.Provider
      value={{ loading, toggleLoading, aboveTreeDepth, belowTreeDepth }}
    >
      {children}
    </AppContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <TheApp />
    </AppContextProvider>
  );
};

const TheApp: React.FC = () => {
  const { loading, aboveTreeDepth, belowTreeDepth, toggleLoading } = useContext(
    AppContext
  );
  return (
    <div>
      <DeepTreeToggler
        label="above"
        depth={aboveTreeDepth}
        toggleLoading={toggleLoading}
      />
      <DeepTreeToggler
        label="below"
        depth={belowTreeDepth}
        toggleLoading={toggleLoading}
      />
      <p>{loading ? "loading" : "not loading"}</p>
    </div>
  );
};

interface DeepTreeProps {
  toggleLoading: () => void;
  label: string;
  depth: number;
}

const DeepTreeToggler: React.FC<DeepTreeProps> = memo(
  ({ toggleLoading, label, depth }) => {
    return (
      <DeepTreeContext.Provider value={{ toggleLoading, label, depth }}>
        <DeepTree />
        <Toggler />
      </DeepTreeContext.Provider>
    );
  }
);

const DeepTree: React.FC = () => {
  const { label, depth } = useContext(DeepTreeContext);
  console.count(`${label} render count`);

  return [...Array(depth)]
    .map((_, i) => depth - i)
    .reduce((nested, level) => {
      return <Nester level={level}>{nested}</Nester>;
    }, <p>{label}</p>);
};

interface NesterProps {
  level: number;
}

const Nester: React.FC<NesterProps> = ({ children, level }) => {
  const { label, depth } = useContext(DeepTreeContext);
  console.count(`nester level ${level} render count`);
  return (
    <div className="nested-component">
      level: {level}, label: {label}, tree depth: {depth} <Toggler />
      {children}
    </div>
  );
};

const Toggler: React.FC = () => {
  const { toggleLoading, label } = useContext(DeepTreeContext);
  return <button onClick={() => toggleLoading()}>Toggle Loading from {label}</button>;
};

export default App;
