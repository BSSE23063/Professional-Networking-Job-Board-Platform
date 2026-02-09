import JobList from '../components/Jobs/JobList';

const JobsPage = () => {
  return (
    <div className="jobs-page">
      <div className="page-header">
        {/* <h1>Find Your Next Opportunity</h1>
        <p>Browse thousands of job listings from top companies</p> */}
      </div>
      <JobList />
    </div>
  );
};

export default JobsPage;