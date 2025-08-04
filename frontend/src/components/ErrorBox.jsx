function ErrorBox({ message = "데이터를 불러오는 중 오류가 발생했습니다." }) {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-md shadow">
        {message}
      </div>
    </div>
  );
}

export default ErrorBox;
