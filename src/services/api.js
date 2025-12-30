const API_BASE_URL = '/api/v1';

// User Authentication APIs
export const signup = async (name, password) => {
  const response = await fetch(`${API_BASE_URL}/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || '회원가입에 실패했습니다.');
  }

  return response.json();
};

export const login = async (name, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || '로그인에 실패했습니다.');
  }

  return response.json();
};

// Position APIs
export const uploadPosition = async (spot_name, x_pos, y_pos, address, pos_explain, memo) => {
  const response = await fetch(`${API_BASE_URL}/pos/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spot_name,
      x_pos,
      y_pos,
      address,
      pos_explain,
      memo
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || '위치 등록에 실패했습니다.');
  }

  return response.json();
};

export const getHeatmapData = async () => {
  const response = await fetch(`${API_BASE_URL}/pos/heatmap`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || '히트맵 데이터를 불러오는데 실패했습니다.');
  }

  return response.json();
};

export const deletePosition = async (pos_id) => {
  const response = await fetch(`${API_BASE_URL}/pos/${pos_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || '위치 삭제에 실패했습니다.');
  }

  return response.json();
};