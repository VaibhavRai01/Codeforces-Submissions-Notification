let intervalId;
let lastSubmissionId = '';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'start') {
    startExtension();
  } else if (request.action === 'stop') {
    stopExtension();
  }
});

function startExtension() {
  if (!intervalId) {
    intervalId = setInterval(checkSubmissions, 5000);
    checkSubmissions(); // Initial check
  }
}

function stopExtension() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function checkSubmissions() {
  fetch('https://codeforces.com/api/user.status?handle=VaibhavRai10&from=1&count=1')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.status === 'OK' && data.result.length > 0) {
        const newSubmission = data.result[0];
        const submissionId = newSubmission.id;
        const verdict = newSubmission.verdict;
        const problemName = newSubmission.problem.name;

        if (submissionId !== lastSubmissionId && verdict!='TESTING' && verdict!=undefined) {
          lastSubmissionId = submissionId;

          chrome.notifications.create('codeforcesNotification', {
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'Codeforces Submission',
            message: `New submission for ${problemName}: ${verdict}`
          });
        }
      }
    })
    .catch(function(error) {
      console.error('Error checking submissions:', error);
    });
}

startExtension();
