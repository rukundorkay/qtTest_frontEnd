import { useEffect, useState } from "react";
import { TaskCard } from "../../components/TaskCard";
import { AnalyticsCard } from "../../components/card";
import NavBar from "../../components/navbar";
import {
  Box,
  Button,
  Flex,
  Select,
  SimpleGrid,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { API } from "../../config/api";
import { API_URL, token } from "../../config/utils";

const TasksPage = () => {
  
  const [visibleTasks, setVisibleTasks] = useState(2);
  const [analytics,setAnalytics] = useState({})

  const loadMoreTasks = () => {
    setVisibleTasks((prevVisibleTasks) => prevVisibleTasks + 2);
  };

  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [remoteTasks, setRemoteTasks] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const sortedTasks = remoteTasks.slice(0, visibleTasks).sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const fetchTasks = async () => {
    setLoading(true);
    await API.get(`${API_URL}task`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => {
        console.log(response);
        setLoading(false);
        setRemoteTasks(response?.data);
      })
      .catch((error) => {
        setLoading(false);
        const {
          data: { metaData },
        } = error.response;
        toast({
          title: "Uh oh! Something went wrong.",
          variant: "destructive",
          description: metaData.message[0],
        });
      });
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    await API.get(`${API_URL}task/analytics`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => {
        console.log(response);
        setLoading(false);
        setAnalytics(response?.data);
      })
      .catch((error) => {
        setLoading(false);
        const {
          data: { metaData },
        } = error.response;
        toast({
          title: "Uh oh! Something went wrong.",
          variant: "destructive",
          description: metaData.message[0],
        });
      });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(remoteTasks);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks");
    XLSX.writeFile(wb, "tasks.xlsx");
  };

  useEffect(() => {
    fetchTasks();
    fetchAnalytics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NavBar />
      <div className="container pt-5 bg-gray-100 min-h-screen">
        <Flex justifyContent="space-between" align="center">
          <Box>
            <h1 className="font-bold text-2xl">Tasks</h1>
          </Box>
          <Box>
            <Button colorScheme="teal" mr={4} onClick={exportToExcel}>
              Export
            </Button>
            <Link to={"/dashboard/create"}>
              <Button colorScheme="blue">Create task</Button>
            </Link>
          </Box>
        </Flex>
        <Box mt={4}>
          <SimpleGrid columns={{ base: 1, lg: 4 }} spacing={5}>
            <AnalyticsCard title="today taks" number={analytics?.today} />
            <AnalyticsCard title="weekly tasks" number={analytics?.weekly} />
            <AnalyticsCard title="monthly tasks" number={analytics?.monthly} />
            <AnalyticsCard title="all tasks" number={analytics?.total} />
          </SimpleGrid>

          <Box mt={5}>
            <Select value={sortOrder} w={60} bg={"white"} onChange={handleSortChange} mb={4}>
              <option value="asc">Sort Ascending</option>
              <option value="desc">Sort Descending</option>
            </Select>

            {loading ? (
              <Spinner />
            ) : (
              sortedTasks
                ?.slice(0, visibleTasks)
                ?.map((task, index) => <TaskCard key={index} task={task} />)
            )}

            <Flex direction="column" align="center" justify="center">
              {visibleTasks < remoteTasks?.length && (
                <Button
                  mt={4}
                  mb={5}
                  onClick={loadMoreTasks}
                  colorScheme="teal"
                  variant="outline"
                >
                  Load More
                </Button>
              )}
            </Flex>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default TasksPage;
