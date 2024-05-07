# Contributing

![Banner](images/banner-contribute.jpg)
We appreciate your interest in contributing to Code RealTime. This article guides to propose changes in Code RealTime public repository on GitHub, and join the development process.

## Prerequisites

- **GitHub Account**: If you don't have an account on GitHub, create a free account at [GitHub Join](https://github.com/join).
- **Git Knowledge**: Familiarity with Git version control software is required. You can find learning resources on GitHub's learning platform [Git Guides](https://github.com/git-guides) to get started with Git.

## Making a change

### Fork the repository

1. Navigate to the Code RealTime repository: [secure-dev-ops/code-realtime](https://github.com/secure-dev-ops/code-realtime).
   
2. Click the "Fork" button in the top-right corner. This creates a copy of the repository in your GitHub account.
   ![Fork repository](images/fork.jpg)

### Clone your fork

1. Open your terminal and use the `git clone` command to create a local copy of your forked repository in your workspace. Replace `<your-username>` with your GitHub username:  
  ``` 
   git clone https://github.com/<your-username>/code-realtime.git
   ```    
2. Navigate to the local directory:  
   ``` 
   cd <your-local-directory>
   ```

### Create a branch and push your changes

1. Create a new branch for your proposed changes. Use a descriptive branch name that reflects your contribution. Here's an example:     
   ``` 
   git checkout -b contribute-feature-x
   ```  
where contribute-feature-x is your new branch name.
2. Make your changes to the relevant files in your local repository.   
   ``` 
   git add <filename1> <filename2> ...
   ```  
3. Commit your changes.  
     ``` 
   git commit -m "Proposed a new change in feature X"
    ```  
4. Push your committed changes to your forked repository on GitHub:  
    ``` 
   git push origin contribute-feature-x
    ``` 

## Creating a pull request

1. Visit your forked repository on GitHub (e.g., 'https://github.com/your-username/code-realtime').

2. Locate the **Pull requests** tab and click the **New pull request** button.
   ![New pull request](images/new-pull-request.jpg)

3. Select your branch containing the changes (e.g., `contribute-feature-x`) and compare it with the main branch of the upstream repository [secure-devops/code-realtime](https://github.com/secure-dev-ops/code-realtime).

4. Provide a clear and concise title and description for your pull request. In the description, explain the purpose of your changes and how they address an issue or improve the project.

5. Click **Create pull request**.

## Responding to feedback and merging

- Be patient and responsive about feedback from reviewers. Integrate their suggestions into your branch as needed.
- If your pull request gets approved, a reviewer will merge your changes into the main branch.

## Best practices

- Follow coding style guides, if available, to ensure consistency across the codebase.
- Consider adding unit tests to prevent unintended errors, especially if your changes are substantial. Note that you can add unit tests in the [art-comp-test/tests](https://github.com/secure-dev-ops/code-realtime/tree/main/art-comp-test/tests) GitHub repo.
- Stay updated about any changes to the contribution process.  
  
