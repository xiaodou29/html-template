import $ from 'jquery';
import './index.scss';

interface RequestHeaders {
  [key: string]: string;
}

interface HttpResponse {
  status: number;
  statusText: string;
  headers: Headers;
  body: any;
  responseTime: number;
}

// 示例数据
const examples = {
  get: {
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: null
  },
  post: {
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Test Post',
      body: 'This is a test post',
      userId: 1
    }, null, 2)
  },
  put: {
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 1,
      title: 'Updated Post',
      body: 'This post has been updated',
      userId: 1
    }, null, 2)
  }
};

// 全局变量
let startTime: number;

$(function() {
  // 初始化页面
  initializePage();
  
  // 绑定事件
  bindEvents();
  
  // 添加全局函数
  (window as any).loadExample = loadExample;
});

function initializePage() {
  // 默认添加一个Content-Type请求头
  addHeaderRow();
  
  // 根据请求方法显示/隐藏请求体
  toggleRequestBodySection();
  
  // 添加页面加载动画
  $('.card').each(function(index) {
    $(this).css('animation-delay', `${index * 0.1}s`);
  });
}

function bindEvents() {
  // 请求方法变化时显示/隐藏请求体
  $('#methodSelect').on('change', toggleRequestBodySection);
  
  // 添加请求头
  $('#addHeader').on('click', addHeaderRow);
  
  // 删除请求头
  $(document).on('click', '.remove-header', function() {
    $(this).closest('.row').remove();
  });
  
  // 发送请求
  $('#httpRequestForm').on('submit', handleRequest);
  
  // 输入框焦点效果
  $('.form-control, .form-select').on('focus', function() {
    $(this).parent().addClass('focused');
  }).on('blur', function() {
    $(this).parent().removeClass('focused');
  });
}

function toggleRequestBodySection() {
  const method = $('#methodSelect').val() as string;
  const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);
  
  if (hasBody) {
    $('#requestBodySection').slideDown(300);
  } else {
    $('#requestBodySection').slideUp(300);
  }
}

function addHeaderRow() {
  const headerRow = `
    <div class="row g-2 mb-2 header-row">
      <div class="col-md-5">
        <input type="text" class="form-control header-key" placeholder="Header Name">
      </div>
      <div class="col-md-5">
        <input type="text" class="form-control header-value" placeholder="Header Value">
      </div>
      <div class="col-md-2">
        <button type="button" class="btn btn-outline-danger btn-sm remove-header w-100">
          <i class="fas fa-trash me-1"></i>
          删除
        </button>
      </div>
    </div>
  `;
  $('#headersContainer').append(headerRow);
  
  // 添加动画效果
  const newRow = $('#headersContainer .header-row:last');
  newRow.hide().slideDown(300);
}

function getHeaders(): RequestHeaders {
  const headers: RequestHeaders = {};
  
  $('.header-key').each(function(index) {
    const key = $(this).val() as string;
    const value = $(`.header-value`).eq(index).val() as string;
    
    if (key && value) {
      headers[key] = value;
    }
  });
  
  return headers;
}

function getRequestBody(): any {
  const bodyText = $('#requestBody').val() as string;
  if (!bodyText) return null;
  
  try {
    return JSON.parse(bodyText);
  } catch (error) {
    throw new Error('请求体格式错误，请检查JSON格式');
  }
}

function showLoading(show: boolean) {
  if (show) {
    $('#loadingSpinner').show();
    $('#sendRequest').prop('disabled', true);
    $('#sendRequest .fas').hide();
  } else {
    $('#loadingSpinner').hide();
    $('#sendRequest').prop('disabled', false);
    $('#sendRequest .fas').show();
  }
}

function showResponse(response: HttpResponse) {
  $('#responseSection').slideDown(400);
  $('#errorSection').slideUp(400);
  
  // 显示状态码
  const statusClass = response.status >= 200 && response.status < 300 ? 'alert-success' : 'alert-danger';
  $('#statusCode').removeClass('alert-success alert-danger').addClass(statusClass)
    .html(`<i class="fas fa-${response.status >= 200 && response.status < 300 ? 'check-circle' : 'exclamation-triangle'} me-2"></i>${response.status} ${response.statusText}`);
  
  // 显示响应时间
  $('#responseTime').html(`<i class="fas fa-clock me-2"></i>${response.responseTime}ms`);
  
  // 显示响应头
  const headersText = Array.from(response.headers.entries())
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
  $('#responseHeaders').text(headersText);
  
  // 显示响应体
  const bodyText = typeof response.body === 'object' 
    ? JSON.stringify(response.body, null, 2)
    : response.body;
  $('#responseBody').text(bodyText);
  
  // 添加成功动画
  $('#responseSection .card').addClass('animate__animated animate__fadeInUp');
}

function showError(message: string) {
  $('#errorSection').slideDown(400);
  $('#responseSection').slideUp(400);
  $('#errorMessage').html(`<i class="fas fa-exclamation-triangle me-2"></i>${message}`);
  
  // 添加错误动画
  $('#errorSection .card').addClass('animate__animated animate__shakeX');
}

async function handleRequest(event: Event) {
  event.preventDefault();
  
  const url = $('#urlInput').val() as string;
  const method = $('#methodSelect').val() as string;
  
  if (!url) {
    showError('请输入请求地址');
    return;
  }
  
  try {
    showLoading(true);
    startTime = Date.now();
    
    const headers = getHeaders();
    const body = getRequestBody();
    
    const requestOptions: RequestInit = {
      method: method,
      headers: headers
    };
    
    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      requestOptions.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, requestOptions);
    const responseTime = Date.now() - startTime;
    
    let responseBody;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }
    
    const httpResponse: HttpResponse = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      body: responseBody,
      responseTime: responseTime
    };
    
    showResponse(httpResponse);
    
  } catch (error) {
    console.error('请求错误:', error);
    showError(error instanceof Error ? error.message : '请求失败，请检查网络连接');
  } finally {
    showLoading(false);
  }
}

// 加载示例函数
function loadExample(type: 'get' | 'post' | 'put') {
  const example = examples[type];
  
  if (example) {
    // 清空现有数据
    $('#urlInput').val('');
    $('#methodSelect').val('GET');
    $('#headersContainer').empty();
    $('#requestBody').val('');
    
    // 设置示例数据
    $('#urlInput').val(example.url);
    $('#methodSelect').val(example.method);
    
    // 添加请求头
    Object.entries(example.headers).forEach(([key, value]) => {
      addHeaderRow();
      const lastRow = $('#headersContainer .header-row:last');
      lastRow.find('.header-key').val(key);
      lastRow.find('.header-value').val(value);
    });
    
    // 设置请求体
    if (example.body) {
      $('#requestBody').val(example.body);
    }
    
    // 触发方法变化事件
    $('#methodSelect').trigger('change');
    
    // 显示成功提示
    showToast(`已加载${type.toUpperCase()}请求示例`);
  }
}

// 显示提示信息
function showToast(message: string) {
  const toast = $(`
    <div class="toast-container position-fixed top-0 end-0 p-3">
      <div class="toast" role="alert">
        <div class="toast-header">
          <i class="fas fa-info-circle text-primary me-2"></i>
          <strong class="me-auto">提示</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
          ${message}
        </div>
      </div>
    </div>
  `);
  
  $('body').append(toast);
  const toastElement = toast.find('.toast');
  
  // 显示toast
  toastElement.toast({
    autohide: true,
    delay: 3000
  });
  toastElement.toast('show');
  
  // 自动移除
  setTimeout(() => {
    toast.remove();
  }, 3500);
}