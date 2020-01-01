import React, { useState, useContext, memo, useCallback } from "react";

const Context = React.createContext({
  loading: false,
  aboveTreeDepth: 0,
  belowTreeDepth: 0,
  toggleLoading: (): void => {
    throw new Error("toggleLoading not implemented");
  },
});

const ContextProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const toggleLoading = useCallback(() => {
    setLoading(!loading);
  }, [setLoading, loading]);

  const aboveTreeDepth = 0;
  const belowTreeDepth = 10;

  return (
    <Context.Provider value={{ loading, toggleLoading, aboveTreeDepth, belowTreeDepth }}>
      {children}
    </Context.Provider>
  );
};

const App: React.FC = () => {
  return (
    <ContextProvider>
      <TheApp />
    </ContextProvider>
  );
};

const TheApp: React.FC = () => {
  const { loading, aboveTreeDepth, belowTreeDepth, toggleLoading } = useContext(Context);
  return (
    <div>
      <DeepTreeToggler
        label={"above"}
        treeDepth={aboveTreeDepth}
        toggleLoading={toggleLoading}
      />
      <DeepTreeToggler
        label={"below"}
        treeDepth={belowTreeDepth}
        toggleLoading={toggleLoading}
      />
      <p>{loading ? "loading" : "not loading"}</p>
    </div>
  );
};

interface DeepTreeProps {
  label: string;
  treeDepth?: number;
}

type DeepTreeTogglerProps = DeepTreeProps & {
  toggleLoading: () => void;
};

const DeepTreeToggler: React.FC<DeepTreeTogglerProps> = ({
  label,
  treeDepth,
  toggleLoading,
}) => {
  return (
    <>
      <DeepTree label={label} treeDepth={treeDepth} />
      <button onClick={() => toggleLoading()}>Toggle Loading from {label}</button>
    </>
  );
};

const DeepTree: React.FC<DeepTreeProps> = memo(({ label, treeDepth = 0 }) => {
  console.count(`${label} render count`);

  return [...Array(treeDepth)]
    .map((_, i) => treeDepth - i)
    .reduce((nested, level) => {
      return <Nester level={level}>{nested}</Nester>;
    }, <p>{label}</p>);
});

interface NesterProps {
  level: number;
}

const Nester: React.FC<NesterProps> = ({ children, level }) => {
  console.count(`nester level ${level} render count`);
  return (
    <div className="nested-component">
      level: {level}
      {children}
    </div>
  );
};

export default App;
