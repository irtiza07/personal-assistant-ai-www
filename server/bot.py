from llama_index import GPTSimpleVectorIndex, SimpleDirectoryReader
# Load data from the journal text file
documents = SimpleDirectoryReader("./data").load_data()
# Create a simple vector index
index = GPTSimpleVectorIndex(documents)
index.save_to_disk("generated_index.json")
# Create an infinite loop asking for user input and then breaking out of the loop when the response is empty
while True:
    query = input("Ask a question: ")
    if not query:
        print("Goodbye")
        break
    # query the index with the question and print the result
    result = index.query(query)
    print(result)
